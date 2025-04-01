import { json } from '@remix-run/node';

export const loader = async ({ request }) => {
    console.log('request--',request);
    
   return json({
    ok:true,
    message:"api has been working with get request"
   });
  };
