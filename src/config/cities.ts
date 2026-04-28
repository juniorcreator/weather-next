export interface City {
  name: string;
  country: string;
  region?: string;
  population?: number;
}

export const usCities: City[] = [
  { name: "New York", country: "United States", region: "New York", population: 8336817 },
  { name: "Los Angeles", country: "United States", region: "California", population: 3979576 },
  { name: "Chicago", country: "United States", region: "Illinois", population: 2693976 },
  { name: "Houston", country: "United States", region: "Texas", population: 2320268 },
  { name: "Phoenix", country: "United States", region: "Arizona", population: 1680992 },
  { name: "Philadelphia", country: "United States", region: "Pennsylvania", population: 1584064 },
  { name: "San Antonio", country: "United States", region: "Texas", population: 1547253 },
  { name: "San Diego", country: "United States", region: "California", population: 1423851 },
  { name: "Dallas", country: "United States", region: "Texas", population: 1343573 },
  { name: "San Jose", country: "United States", region: "California", population: 1021795 },
  { name: "Austin", country: "United States", region: "Texas", population: 978908 },
  { name: "Jacksonville", country: "United States", region: "Florida", population: 911507 },
  { name: "Fort Worth", country: "United States", region: "Texas", population: 918915 },
  { name: "Columbus", country: "United States", region: "Ohio", population: 898553 },
  { name: "Charlotte", country: "United States", region: "North Carolina", population: 885708 },
  { name: "San Francisco", country: "United States", region: "California", population: 873965 },
  { name: "Indianapolis", country: "United States", region: "Indiana", population: 876384 },
  { name: "Seattle", country: "United States", region: "Washington", population: 753675 },
  { name: "Denver", country: "United States", region: "Colorado", population: 727211 },
  { name: "Washington DC", country: "United States", region: "District of Columbia", population: 705749 },
  { name: "Boston", country: "United States", region: "Massachusetts", population: 692600 },
  { name: "El Paso", country: "United States", region: "Texas", population: 681728 },
  { name: "Detroit", country: "United States", region: "Michigan", population: 674841 },
  { name: "Nashville", country: "United States", region: "Tennessee", population: 670820 },
  { name: "Portland", country: "United States", region: "Oregon", population: 654741 },
  { name: "Memphis", country: "United States", region: "Tennessee", population: 651073 },
  { name: "Oklahoma City", country: "United States", region: "Oklahoma", population: 655057 },
  { name: "Las Vegas", country: "United States", region: "Nevada", population: 641903 },
  { name: "Louisville", country: "United States", region: "Kentucky", population: 617638 },
  { name: "Baltimore", country: "United States", region: "Maryland", population: 602495 },
  { name: "Milwaukee", country: "United States", region: "Wisconsin", population: 594833 },
  { name: "Albuquerque", country: "United States", region: "New Mexico", population: 560513 },
  { name: "Tucson", country: "United States", region: "Arizona", population: 548073 },
  { name: "Fresno", country: "United States", region: "California", population: 542107 },
  { name: "Sacramento", country: "United States", region: "California", population: 524943 },
  { name: "Kansas City", country: "United States", region: "Missouri", population: 508090 },
  { name: "Mesa", country: "United States", region: "Arizona", population: 518012 },
  { name: "Atlanta", country: "United States", region: "Georgia", population: 506811 },
  { name: "Omaha", country: "United States", region: "Nebraska", population: 486051 },
  { name: "Miami", country: "United States", region: "Florida", population: 470914 },
  { name: "Cleveland", country: "United States", region: "Ohio", population: 383793 },
  { name: "Tulsa", country: "United States", region: "Oklahoma", population: 401190 },
  { name: "Oakland", country: "United States", region: "California", population: 433031 },
  { name: "Minneapolis", country: "United States", region: "Minnesota", population: 429606 },
  { name: "Wichita", country: "United States", region: "Kansas", population: 389938 },
  { name: "Arlington", country: "United States", region: "Texas", population: 398854 },
  { name: "Tampa", country: "United States", region: "Florida", population: 384959 },
  { name: "New Orleans", country: "United States", region: "Louisiana", population: 383997 },
  { name: "Honolulu", country: "United States", region: "Hawaii", population: 350964 },
  { name: "Raleigh", country: "United States", region: "North Carolina", population: 474069 },
];

export const englishSpeakingCities: City[] = [
  { name: "London", country: "United Kingdom", region: "England", population: 8982000 },
  { name: "Manchester", country: "United Kingdom", region: "England", population: 547627 },
  { name: "Birmingham", country: "United Kingdom", region: "England", population: 1141816 },
  { name: "Liverpool", country: "United Kingdom", region: "England", population: 498042 },
  { name: "Glasgow", country: "United Kingdom", region: "Scotland", population: 635640 },
  { name: "Edinburgh", country: "United Kingdom", region: "Scotland", population: 518500 },
  { name: "Belfast", country: "United Kingdom", region: "Northern Ireland", population: 345006 },
  { name: "Cardiff", country: "United Kingdom", region: "Wales", population: 362750 },
  
  { name: "Toronto", country: "Canada", region: "Ontario", population: 2930000 },
  { name: "Vancouver", country: "Canada", region: "British Columbia", population: 675218 },
  { name: "Calgary", country: "Canada", region: "Alberta", population: 1306784 },
  { name: "Edmonton", country: "Canada", region: "Alberta", population: 1010899 },
  { name: "Winnipeg", country: "Canada", region: "Manitoba", population: 749607 },
  { name: "Ottawa", country: "Canada", region: "Ontario", population: 1017449 },
  { name: "Montreal", country: "Canada", region: "Quebec", population: 1780000 },
  { name: "Quebec City", country: "Canada", region: "Quebec", population: 549459 },
  { name: "Halifax", country: "Canada", region: "Nova Scotia", population: 403131 },
  
  { name: "Sydney", country: "Australia", region: "New South Wales", population: 5312163 },
  { name: "Melbourne", country: "Australia", region: "Victoria", population: 5078193 },
  { name: "Brisbane", country: "Australia", region: "Queensland", population: 2487098 },
  { name: "Perth", country: "Australia", region: "Western Australia", population: 2142187 },
  { name: "Adelaide", country: "Australia", region: "South Australia", population: 1358820 },
  { name: "Canberra", country: "Australia", region: "Australian Capital Territory", population: 462213 },
  { name: "Darwin", country: "Australia", region: "Northern Territory", population: 147255 },
  { name: "Hobart", country: "Australia", region: "Tasmania", population: 240342 },
  
  { name: "Auckland", country: "New Zealand", region: "Auckland", population: 1657000 },
  { name: "Wellington", country: "New Zealand", region: "Wellington", population: 215100 },
  { name: "Christchurch", country: "New Zealand", region: "Canterbury", population: 383200 },
  { name: "Hamilton", country: "New Zealand", region: "Waikato", population: 176500 },
  { name: "Dunedin", country: "New Zealand", region: "Otago", population: 130400 },
  
  { name: "Dublin", country: "Ireland", region: "Leinster", population: 1173179 },
  { name: "Cork", country: "Ireland", region: "Munster", population: 210000 },
  { name: "Limerick", country: "Ireland", region: "Munster", population: 102287 },
  { name: "Galway", country: "Ireland", region: "Connacht", population: 79934 },
  
  { name: "Cape Town", country: "South Africa", region: "Western Cape", population: 4618000 },
  { name: "Johannesburg", country: "South Africa", region: "Gauteng", population: 5636000 },
  { name: "Durban", country: "South Africa", region: "KwaZulu-Natal", population: 3442361 },
  { name: "Pretoria", country: "South Africa", region: "Gauteng", population: 741651 },
];

export const allCities: City[] = [
  ...usCities,
  ...englishSpeakingCities,
];

export const getCityNames = (): string[] => {
  return allCities.map(city => city.name);
};

export const getCityKeywords = (cityName: string): string[] => {
  return [
    `weather ${cityName}`,
    `${cityName} weather`,
    `weather forecast ${cityName}`,
    `weather forecast for ${cityName}`,
    `current weather ${cityName}`,
    `current weather in ${cityName}`,
    `today's weather ${cityName}`,
    `tomorrow's weather ${cityName}`,
    `${cityName} weather forecast`,
    `${cityName} weather today`,
    `${cityName} weather tomorrow`,
  ];
};

export const popularCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "London",
  "Toronto",
  "Sydney",
  "Melbourne",
  "Auckland",
  "Dublin",
  "Vancouver",
];

