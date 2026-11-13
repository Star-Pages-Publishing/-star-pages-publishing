const crypto = require('crypto');
const CATALOG = {
 'star-colouring':{title:'Star Colouring',prices:{paperback:99,ebook:99}},
 'the-last-call':{title:'The Last Call',prices:{paperback:99,ebook:99}},
 'star-stories':{title:'Star Stories',prices:{paperback:99,ebook:99}},
 'beginner-robotics':{title:'Beginner Robotics Projects',prices:{paperback:99,ebook:99}},
 'embedded-esp32':{title:'Embedded Systems with ESP32',prices:{paperback:99,ebook:99}},
 'arduino-robotics':{title:'Arduino Robotics & STEM Projects for Beginners',prices:{paperback:99,ebook:99}}
};
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return{statusCode:405,body:'Method not allowed'};
 try{
  const{bookId,edition,customer}=JSON.parse(event.body||'{}'),book=CATALOG[bookId];
  if(!book||!['paperback','ebook'].includes(edition))return{statusCode:400,body:JSON.stringify({error:'Please choose a valid book and edition.'})};
  if(!customer||!customer.name||!customer.email||!customer.phone)return{statusCode:400,body:JSON.stringify({error:'Please provide name, email and phone.'})};
  const price=book.prices[edition];if(!Number.isInteger(price)||price<1)return{statusCode:400,body:JSON.stringify({error:'This edition is not available.'})};
  const keyId=process.env.RAZORPAY_KEY_ID,keySecret=process.env.RAZORPAY_KEY_SECRET;
  if(!keyId||!keySecret)return{statusCode:503,body:JSON.stringify({error:'Online payments are not configured yet. Please try again later.'})};
  const auth=Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({amount:price*100,currency:'INR',receipt:`sp_${crypto.randomBytes(6).toString('hex')}`,notes:{bookId,bookTitle:book.title,edition,customerName:customer.name,customerEmail:customer.email,customerPhone:customer.phone}})});
  const order=await response.json();if(!response.ok)return{statusCode:502,body:JSON.stringify({error:'Payment provider could not create the order.'})};
  return{statusCode:200,headers:{'Content-Type':'application/json'},body:JSON.stringify({keyId,orderId:order.id,amount:order.amount,currency:order.currency,edition})};
 }catch(e){return{statusCode:500,body:JSON.stringify({error:'Unable to start checkout.'})}}
};