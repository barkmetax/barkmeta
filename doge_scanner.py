#!/usr/bin/env python3
"""
Dogecoin Wallet Balance Scanner

Reads a CSV of Dogecoin wallet addresses, checks balances via the Blockchair API,
and reports wallets with >= 100 DOGE.

Usage:
    Double-click this file, OR run: python doge_scanner.py <path_to_csv>
"""

import csv
import os
import subprocess
import sys
import time


def install_dependencies():
    """Auto-install required packages if missing."""
    required = ["requests", "rich", "tqdm"]
    missing = []
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)
    if missing:
        print(f"Installing required packages: {', '.join(missing)}...")
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install"] + missing,
            stdout=subprocess.DEVNULL,
        )
        print("Done!\n")


install_dependencies()

import requests  # noqa: E402
from rich.console import Console  # noqa: E402
from rich.table import Table  # noqa: E402
from tqdm import tqdm  # noqa: E402

BLOCKCHAIR_URL = "https://api.blockchair.com/dogecoin/addresses/balances"
SATOSHIS_PER_DOGE = 100_000_000
BATCH_SIZE = 100
DEFAULT_DELAY = 1.5
RATE_LIMIT_DELAY = 5.0
MIN_DOGE_BALANCE = 100
MAX_RETRIES = 2
RETRY_WAIT = 5


def detect_address_column(reader, header):
    """Auto-detect which column contains Dogecoin addresses (start with 'D', 34 chars)."""
    # Read a sample of rows to detect the column
    sample_rows = []
    for i, row in enumerate(reader):
        sample_rows.append(row)
        if i >= 19:  # Check up to 20 rows
            break

    best_col = None
    best_count = 0

    for col_idx in range(len(header)):
        matches = 0
        for row in sample_rows:
            if col_idx < len(row):
                val = row[col_idx].strip()
                if val.startswith("D") and len(val) == 34:
                    matches += 1
        if matches > best_count:
            best_count = matches
            best_col = col_idx

    if best_col is None or best_count == 0:
        return None, sample_rows

    return best_col, sample_rows


def read_addresses(csv_path):
    """Read Dogecoin addresses from a CSV file, auto-detecting the address column."""
    addresses = []
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        sniffer = csv.Sniffer()
        sample = f.read(8192)
        f.seek(0)

        try:
            has_header = sniffer.has_header(sample)
        except csv.Error:
            has_header = True

        reader = csv.reader(f)
        if has_header:
            header = next(reader)
        else:
            # Peek at first row to get column count
            header = [f"col_{i}" for i in range(20)]

        col_idx, buffered_rows = detect_address_column(reader, header)
        if col_idx is None:
            print("Error: Could not detect a column with Dogecoin addresses.")
            print("Addresses should start with 'D' and be 34 characters long.")
            sys.exit(1)

        col_name = header[col_idx] if col_idx < len(header) else f"column {col_idx}"
        print(f"Detected address column: '{col_name}' (index {col_idx})")

        # Process buffered rows
        for row in buffered_rows:
            if col_idx < len(row):
                addr = row[col_idx].strip()
                if addr.startswith("D") and len(addr) == 34:
                    addresses.append(addr)

        # Process remaining rows
        for row in reader:
            if col_idx < len(row):
                addr = row[col_idx].strip()
                if addr.startswith("D") and len(addr) == 34:
                    addresses.append(addr)

    return addresses


def query_balances(addresses):
    """Query Blockchair for balances of all addresses, batched in groups of 100."""
    console = Console()
    balances = {}
    skipped = []
    delay = DEFAULT_DELAY
    rate_limited = False

    batches = [addresses[i : i + BATCH_SIZE] for i in range(0, len(addresses), BATCH_SIZE)]
    total_batches = len(batches)

    console.print(
        f"\nQuerying {len(addresses)} addresses in {total_batches} batches...\n"
    )

    progress = tqdm(total=total_batches, desc="Scanning wallets", unit="batch")

    for batch_idx, batch in enumerate(batches):
        success = False
        for attempt in range(MAX_RETRIES + 1):
            try:
                params = {"addresses": ",".join(batch)}
                resp = requests.get(BLOCKCHAIR_URL, params=params, timeout=30)

                if resp.status_code in (402, 429):
                    if not rate_limited:
                        rate_limited = True
                        delay = RATE_LIMIT_DELAY
                        tqdm.write(
                            f"[!] Rate limit hit (HTTP {resp.status_code}). "
                            f"Slowing to {delay}s between batches."
                        )
                    if attempt < MAX_RETRIES:
                        time.sleep(RETRY_WAIT)
                        continue
                    else:
                        break

                resp.raise_for_status()
                data = resp.json().get("data", {})
                if data:
                    for addr, satoshis in data.items():
                        balances[addr] = satoshis
                success = True
                break

            except (requests.RequestException, ValueError) as e:
                if attempt < MAX_RETRIES:
                    tqdm.write(
                        f"[!] Batch {batch_idx + 1} attempt {attempt + 1} failed: {e}. "
                        f"Retrying in {RETRY_WAIT}s..."
                    )
                    time.sleep(RETRY_WAIT)
                else:
                    tqdm.write(
                        f"[!] Batch {batch_idx + 1} failed after {MAX_RETRIES + 1} attempts. "
                        f"Skipping {len(batch)} addresses."
                    )

        if not success:
            skipped.extend(batch)

        progress.update(1)

        # Delay between batches (not after the last one)
        if batch_idx < total_batches - 1:
            time.sleep(delay)

    progress.close()

    if skipped:
        console.print(
            f"\n[yellow]Warning: {len(skipped)} addresses were skipped due to API errors.[/yellow]"
        )

    return balances, skipped


def filter_and_rank(balances):
    """Filter wallets with >= 100 DOGE and sort by balance descending."""
    funded = []
    for addr, satoshis in balances.items():
        doge = satoshis / SATOSHIS_PER_DOGE
        if doge >= MIN_DOGE_BALANCE:
            funded.append((addr, doge))

    funded.sort(key=lambda x: x[1], reverse=True)
    return funded


def display_table(funded):
    """Print a rich table of funded wallets."""
    console = Console()

    if not funded:
        console.print("\n[yellow]No wallets found with >= 100 DOGE.[/yellow]")
        return

    table = Table(title="Funded Dogecoin Wallets (>= 100 DOGE)")
    table.add_column("Rank", justify="right", style="cyan")
    table.add_column("Address", style="white")
    table.add_column("Balance (DOGE)", justify="right", style="green")

    for rank, (addr, doge) in enumerate(funded, start=1):
        table.add_row(str(rank), addr, f"{doge:,.8f}")

    console.print()
    console.print(table)


def save_csv(funded, output_path):
    """Save funded wallets to a CSV file."""
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["rank", "address", "balance_doge"])
        for rank, (addr, doge) in enumerate(funded, start=1):
            writer.writerow([rank, addr, f"{doge:.8f}"])


def print_summary(total_scanned, funded, skipped_count):
    """Print a summary of the scan."""
    console = Console()
    total_doge = sum(doge for _, doge in funded)

    console.print("\n--- Summary ---")
    console.print(f"Total wallets scanned:    {total_scanned:,}")
    console.print(f"Wallets with >= 100 DOGE: {len(funded):,}")
    console.print(f"Total DOGE (funded):      {total_doge:,.8f}")
    if skipped_count > 0:
        console.print(f"Addresses skipped (errors): {skipped_count:,}")
    console.print()


def pick_file():
    """Open a file picker dialog so the user can select their CSV."""
    try:
        import tkinter as tk
        from tkinter import filedialog

        root = tk.Tk()
        root.withdraw()  # Hide the main window
        root.attributes("-topmost", True)
        file_path = filedialog.askopenfilename(
            title="Select your CSV file with Dogecoin addresses",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
        )
        root.destroy()
        return file_path
    except Exception:
        return None


def main():
    # If a CSV path was passed as an argument, use it.
    # Otherwise, open a file picker window.
    if len(sys.argv) > 1:
        csv_path = os.path.abspath(sys.argv[1])
    else:
        print("No file specified — opening file picker...\n")
        csv_path = pick_file()
        if not csv_path:
            print("No file selected. Exiting.")
            input("\nPress Enter to close...")
            sys.exit(0)

    csv_path = os.path.abspath(csv_path)
    if not os.path.isfile(csv_path):
        print(f"Error: File not found: {csv_path}")
        input("\nPress Enter to close...")
        sys.exit(1)

    console = Console()
    console.print("[bold]Dogecoin Wallet Scanner[/bold]")
    console.print(f"Input: {csv_path}\n")

    # Step 1: Read addresses
    addresses = read_addresses(csv_path)
    if not addresses:
        print("Error: No valid Dogecoin addresses found in the CSV.")
        input("\nPress Enter to close...")
        sys.exit(1)
    console.print(f"Found {len(addresses):,} valid Dogecoin addresses.\n")

    # Step 2: Query balances
    balances, skipped = query_balances(addresses)

    # Step 3: Filter and rank
    funded = filter_and_rank(balances)

    # Step 4: Display table
    display_table(funded)

    # Step 5: Save CSV
    output_dir = os.path.dirname(csv_path)
    output_path = os.path.join(output_dir, "funded_wallets.csv")
    save_csv(funded, output_path)
    console.print(f"\nResults saved to: {output_path}")

    # Step 6: Summary
    print_summary(len(addresses), funded, len(skipped))

    # Keep window open so the user can read the results
    input("\nDone! Press Enter to close...")


if __name__ == "__main__":
    main()
