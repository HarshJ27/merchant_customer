import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import Merchants from "../Models/Merchants.js";
import MerchantAuthenticateToken from "../Middlewares/MerchantAuthenticateToken.js";
import Products from "../Models/Products.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_MERCHANT;

const router = express.Router();

const credentials = {
    accessKeyId: "fXbCVNJL2tv07ndz",
    secretAccessKey: "D0wx5XlO5xeBA7Q6DOcmp7k2GaIVPLhkXL5oid5X"
};

// Create an S3 service client object
const s3Client = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentials,
    region: "global"
});

// UPLOAD PRODUCT IMAGE
const credentialsProduct = {
    accessKeyId: "fXbCVNJL2tv07ndz",
    secretAccessKey: "D0wx5XlO5xeBA7Q6DOcmp7k2GaIVPLhkXL5oid5X"
};

const s3ClientProduct = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentialsProduct,
    region: "global"
});

// Handle Image file upload
router.post('/upload-profile-pic', async (req, res) => {
    try {
        const file = req.files && req.files.merchantPic; // Change 'myFile' to match the key name in Postman
        
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        // Generate a unique identifier
        const uniqueIdentifier = uuidv4();

        // Get the file extension from the original file name
        const fileExtension = file.name.split('.').pop();

        // Create a unique filename by appending the unique identifier to the original filename
        const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

        // Convert file to base64
        const base64Data = file.data.toString('base64');

        // Create a buffer from the base64 data
        const fileBuffer = Buffer.from(base64Data, 'base64');

        const uploadData = await s3Client.send(
            new PutObjectCommand({
                Bucket: "merchantspics",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "merchantspics",
            Key: uniqueFileName
        });

        const signedUrl = await getSignedUrl(s3Client, getObjectCommand); // Generate URL valid for 1 hour

        // Parse the signed URL to extract the base URL
        const parsedUrl = new URL(signedUrl);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

        // Send the URL as a response
        res.status(200).json(baseUrl);

        // Log the URL in the console
        console.log("File uploaded. URL:", baseUrl);
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).send('Error uploading file');
    }
});

// SIGNUP AS MERCHANT
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;
        console.log(name, email);
        
        const userExists = await Merchants.exists({ email });
        if (userExists) {
          return res.status(409).json({ message: "User already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user object
        const newUser = new Merchants({
          name,
          email,
          password: hashedPassword,
          profilePic,
        });
  
        // Save the user to the database
        await newUser.save();
  
        return res
          .status(201)
          .json({ message: "Merchant User created successfully" });

    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

// LOGIN AS MERCHANT
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user in the database
      const user = await Merchants.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare the passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, role: "merchant" }, secretKey, {
        expiresIn: "1h",
      });
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

// GET USER DATA
router.get("/user-data", MerchantAuthenticateToken, async (req, res) => {
    try {
        const {email} = req.user;

        const user = await Merchants.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Merchant not found" });
        }
    
        // Extract the required fields from the user object
        const {
          id,
          name,
          profilePic,
          products
        } = user;
    
        res.status(200).json({
          id,
          name,
          email,
          profilePic,
          products
        });
    } catch(error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ADD PRODUCT IMAGE
router.post('/upload-product-pic', MerchantAuthenticateToken, async (req, res) => {
    try {
        const file = req.files && req.files.productPic; // Change 'myFile' to match the key name in Postman
        
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        // Generate a unique identifier
        const uniqueIdentifier = uuidv4();

        // Get the file extension from the original file name
        const fileExtension = file.name.split('.').pop();

        // Create a unique filename by appending the unique identifier to the original filename
        const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

        // Convert file to base64
        const base64Data = file.data.toString('base64');

        // Create a buffer from the base64 data
        const fileBuffer = Buffer.from(base64Data, 'base64');

        const uploadData = await s3ClientProduct.send(
            new PutObjectCommand({
                Bucket: "productspics",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "productspics",
            Key: uniqueFileName
        });

        const signedUrl = await getSignedUrl(s3ClientProduct, getObjectCommand); // Generate URL valid for 1 hour

        // Parse the signed URL to extract the base URL
        const parsedUrl = new URL(signedUrl);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

        // Send the URL as a response
        res.status(200).json(baseUrl);

        // Log the URL in the console
        console.log("File uploaded. URL:", baseUrl);
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).send('Error uploading file');
    }
});

// ADD A PRODUCT
router.post("/add-product", MerchantAuthenticateToken, async (req, res) => {
    try {
        const {email, userId} = req.user;
        const { name, category, desc, profilePic, quantity, price } = req.body;

        const user = await Merchants.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Merchant not found" });
        }

        const newProduct = new Products({
            name,
            category, 
            desc,
            profilePic,
            quantity,
            company: user.name,
            price
        })

        await newProduct.save();

        const merchantUpdate = await Merchants.findByIdAndUpdate(
            {_id: userId}, {
              $push: {products: newProduct._id}
            }
          )

        res.status(201).json({message: "New Product added successfully!!!", newProduct});
    } catch(error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// GET ALL PRODUCTS
router.get('/products', MerchantAuthenticateToken, async (req, res) => {
    try{
        const {email} = req.user;

        const user = await Merchants.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Merchant not found" });
        }

        const allProducts = await Products.find({});

        res.status(200).json(allProducts);
    } catch(error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET PRODUCTS OF A MERCHANT
router.get('/my-products', MerchantAuthenticateToken, async (req, res) => {
    try{
        const {email} = req.user;

        const user = await Merchants.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Merchant not found" });
        }

        const allProducts = await Products.find({company: user.name});

        res.status(200).json(allProducts);
    } catch(error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET A PRODUCT BY ID
router.get('/products/:id', MerchantAuthenticateToken, async (req, res) => {
    try {
        const {email} = req.user;
        const {id} = req.params;

        const user = await Merchants.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Merchant not found" });
        }

        const product = await Products.findById({_id: id});

        console.log(product);

        res.status(200).json(product);

    } catch(error) {
        console.error("Error fetching a product data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// EDIT PRODUCT DETAILS
router.put('/products/edit/:id', MerchantAuthenticateToken, async (req, res) => {
    try {
        const {email, userId} = req.user;
        const {id} = req.params;
        const { name, category, desc, profilePic, quantity } = req.body;

        const user = await Merchants.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Merchant not found" });
          }

        const product = await Products.findById({_id: id});

        if(name) {
            product.name = name;
            await product.save();
        } else {
            product.name = product.name;
            await product.save();
        }

        if(category) {
            product.category = category;
            await product.save();
        } else {
            product.category = product.category;
            await product.save();
        }

        if(desc) {
            product.desc = desc;
            await product.save();
        } else {
            product.desc = product.desc;
            await product.save();
        }

        if(profilePic) {
            product.profilePic = profilePic;
            await product.save();
        } else {
            product.profilePic = product.profilePic;
            await product.save();
        }

        if(quantity) {
            product.quantity = quantity;
            await product.save();
        } else {
            product.quantity = product.quantity;
            await product.save();
        }

        res.status(201).json({message: "Product details are updated successfully", product})
    } catch(error) {
        console.error("Error editing a product data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;