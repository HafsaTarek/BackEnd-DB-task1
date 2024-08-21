const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


// const jwt=require("jsonwebtoken")

// const mytoken=()=>{
//   const token=jwt.sign({_id:"12345667"},"hafsa520")
//   console.log(token)

//   const tokenverify=jwt.verify(token,"hafsa520")
//   console.log(tokenverify)
// }

// mytoken()



require("./db/mongoose");

app.use(express.json());

const userRouter = require("./routes/user");

app.use(userRouter);

app.listen(port, () => {
  console.log("All done successfully");
});
