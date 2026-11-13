const crypto=require('crypto');
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return{statusCode:405,body:'Method not allowed'};
 try{
  const{razorpay_order_id,razorpay_payment_id,razorpay_signature,bookId,edition}=JSON.parse(event.body||'{}'),secret=process.env.RAZORPAY_KEY_SECRET;
  if(!secret||!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!bookId||!['paperback','ebook'].includes(edition))return{statusCode:400,body:JSON.stringify({error:'Missing payment verification details.'})};
  const expected=crypto.createHmac('sha256',secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex'),a=Buffer.from(expected),b=Buffer.from(razorpay_signature);
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return{statusCode:400,body:JSON.stringify({error:'Payment signature could not be verified.'})};
  // Payment is verified, but persistent order storage and fulfilment must be added before public launch.
  return{statusCode:200,headers:{'Content-Type':'application/json'},body:JSON.stringify({verified:true,orderId:razorpay_order_id,bookId,edition})};
 }catch(e){return{statusCode:500,body:JSON.stringify({error:'Unable to verify payment.'})}}
};