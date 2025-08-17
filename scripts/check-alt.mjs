const urls = [
  'https://techtowndetroit.org/programs',
  'https://michiganworks.org',
  'https://michiganworks.org/locations',
  'https://www.motorcitymatch.com/apply',
  'https://detroitmi.gov/departments/housing-and-revitalization-department',
  'https://detroitmi.gov/departments/housing-and-revitalization-department/programs-and-services',
  'https://www.michigan.gov/mdhhs/assistance-programs/wic',
  'https://www.dteenergy.com/us/en/residential/service-request',
  'https://dhcmi.org',
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