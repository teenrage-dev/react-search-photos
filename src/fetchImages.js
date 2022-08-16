import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page) => {
  const params = new URLSearchParams({
    key: '28032528-2733f4db32465b2bae0fa9703',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: '12',
    page,
  });
  console.log(params);

  const response = await axios.get('/', { params });
  console.log(
    `Fetching images for ${query} page ${page} with ${response.data.hits.length} hits`
  );
  return response.data;
};
