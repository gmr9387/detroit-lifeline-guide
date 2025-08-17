const urls = [
  // Michigan Works!
  'https://www.michiganworks.org/',
  'https://www.michiganworks.org/locations',
  'https://www.michiganworks.org/find-your-agency',
  // TechTown alternatives
  'https://techtowndetroit.org/',
  'https://techtowndetroit.org/programs',
  'https://techtowndetroit.org/programs-services',
  'https://techtowndetroit.org/programs-and-services',
  // Motor City Match
  'https://www.motorcitymatch.com/',
  'https://www.motorcitymatch.com/apply',
  'https://www.motorcitymatch.com/get-started',
  // WIC
  'https://www.michigan.gov/mdhhs/assistance-programs/wic',
  'https://www.michigan.gov/mdhhs/assistance-programs/wic/localagencies',
  'https://detroitmi.gov/departments/detroit-health-department/programs-and-services/wic-women-infants-and-children-program',
  // Detroit Housing/ERAP alternatives
  'https://detroitmi.gov/departments/housing-and-revitalization-department',
  'https://detroitmi.gov/departments/housing-and-revitalization-department/rental-assistance',
  'https://detroithomeconnect.detroitmi.gov/',
  // DHC
  'https://www.dhcmi.org/',
  'https://www.dhcmi.org/housing-programs',
  // DTE
  'https://www.dteenergy.com/us/en/residential/billing-and-payments/energy-assistance/low-income-programs.html',
  'https://www.dteenergy.com/us/en/residential/billing-and-payments/energy-assistance',
  'https://www.dteenergy.com/us/en/residential/service-request',
  // 2-1-1 and Wayne Metro
  'https://www.mi211.org/',
  'https://www.waynemetro.org/',
  // Food
  'https://www.gcfb.org/',
  'https://www.gcfb.org/findfood/',
  'https://www.forgottenharvest.org/',
  'https://www.forgottenharvest.org/find-food/',
  // Utilities assistance
  'https://thawfund.org/',
  // Childcare resources
  'https://www.greatstarttoquality.org/',
  'https://www.greatstarttoquality.org/find-programs',
  'https://www.michigan.gov/mdhhs/assistance-programs/child-care',
  // Financial/SER
  'https://www.michigan.gov/mdhhs/assistance-programs/ser',
  // United Way SEM
  'https://unitedwaysem.org/community-resources/',
  // Bank On Detroit
  'https://bankondetroit.org/',
  // Detroit Means Business
  'https://www.detroitmeansbusiness.org/'
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