export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.doggy.market/nfts/doginaldogs');
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Doginal Dog floor data.' });
  }
}
