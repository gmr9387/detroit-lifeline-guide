const urls = [
  'https://www.michiganworks.org',
  'https://www.michiganworks.org/locations',
  'https://techtowndetroit.org',
  'https://techtowndetroit.org/programs/',
  'https://motorcitymatch.com',
  'https://motorcitymatch.com/apply/',
  'https://www.4c.wayne.edu',
  'https://www.4c.wayne.edu/child-care-assistance',
  'https://www.michigan.gov/wic',
  'https://www.michigan.gov/wic/find-wic-clinic',
  'https://www.dhcmi.org',
  'https://www.dhcmi.org/housing-programs',
  'https://detroitmi.gov/departments/housing-and-revitalization-department/programs-and-services/emergency-rental-assistance-program-erap',
  'https://erap.detroitmi.gov/',
  'https://www.michigan.gov/mibridges',
  'https://newmibridges.michigan.gov/',
  'https://www.dteenergy.com/us/en/residential/service-request/assistance-programs',
  'https://www.dteenergy.com/residential/assistance-programs',
  'https://lovable.dev/opengraph-image-p98pqg.png',
  'https://ui.shadcn.com/schema.json',
];

async function check(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; LinkCheck/1.0)'
      }
    });
    console.log(url);
    console.log(`${res.status}\t${res.url}`);
    console.log('');
  } catch (err) {
    console.log(url);
    console.log(`ERROR\t${err && err.message ? err.message : String(err)}`);
    console.log('');
  } finally {
    clearTimeout(timeout);
  }
}

(async () => {
  for (const u of urls) {
    // eslint-disable-next-line no-await-in-loop
    await check(u);
  }
})();