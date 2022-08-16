import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page) => {
  const params = {
    key: '28032528-2733f4db32465b2bae0fa9703',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: '12',
    page,
  };
  // console.log(params);
  try {
    const response = await axios.get('/', { params });

    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};
