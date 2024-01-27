import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import Customers from "../Models/Customers.js";
import CustomerAuthenticateToken from "../Middlewares/CustomerAuthenticateToken.js";
import Products from "../Models/Products.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_CUSTOMER;

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

// Handle Image file upload
router.post('/upload-profile-pic', async (req, res) => {
    try {
        const file = req.files && req.files.customerPic; // Change 'myFile' to match the key name in Postman
        
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
                Bucket: "customerpics",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "customerpics",
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

// SIGNUP AS CUSTOMER
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;
        console.log(name, email);

        const userExists = await Customers.exists({ email });
        if (userExists) {
          return res.status(409).json({ message: "User already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user object
        const newUser = new Customers({
          name,
          email,
          password: hashedPassword,
          profilePic,
        });
  
        // Save the user to the database
        await newUser.save();
  
        return res
          .status(201)
          .json({ message: "User created successfully" });

    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

// LOGIN AS CUSTOMER
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user in the database
      const user = await Customers.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare the passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, role: "customer" }, secretKey, {
        expiresIn: "1h",
      });
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

// GET USER DATA
router.get("/user-data", CustomerAuthenticateToken, async (req, res) => {
    try {
        const {email} = req.user;

        const user = await Customers.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Customer not found" });
        }
    
        // Extract the required fields from the user object
        const {
          id,
          name,
          profilePic,
        } = user;
    
        res.status(200).json({
          id,
          name,
          email,
          profilePic,
        });
    } catch(error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// GET ALL PRODUCTS
router.get('/products', CustomerAuthenticateToken, async (req, res) => {
    try{
        const {email} = req.user;

        const user = await Customers.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Customer not found" });
        }

        const allProducts = await Products.find({});

        res.status(200).json(allProducts);
    } catch(error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// GET QUERY PRODUCTS
router.get('/products', CustomerAuthenticateToken, async (req, res) => {
    try{
        const {email} = req.user;

        const user = await Customers.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Customer not found" });
        }

        const allProducts = await Products.find({});

        res.status(200).json(allProducts);
    } catch(error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// GET FILTERED PRODUCTS
router.get('/filtered-products', CustomerAuthenticateToken, async (req, res) => {
    try {
        const { email } = req.user;
        const user = await Customers.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Extract filter parameters from the query
        const { companies, categories, priceRanges } = req.query;

        // Construct a filter object based on the provided parameters
        const filter = {};
        if (companies) {
            filter.company = { $in: companies.split(',') };
        }
        if (categories) {
            filter.category = { $in: categories.split(',') };
        }
        if (priceRanges) {
            const priceRangesArray = priceRanges.split(',');
            const priceFilters = priceRangesArray.map(range => {
                const [min, max] = range.split('-');
                return { price: { $gte: parseInt(min), $lte: parseInt(max) } };
            });
            filter.$or = priceFilters;
        }

        // Query the database with the constructed filter
        const filteredProducts = await Products.find(filter);

        res.status(200).json(filteredProducts);
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// GET A PRODUCT BY ID
router.get('/products/:id', CustomerAuthenticateToken, async (req, res) => {
    try {
        const {email} = req.user;
        const {id} = req.params;

        const user = await Customers.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "Customer not found" });
        }

        const product = await Products.findById({_id: id});

        console.log(product);

        res.status(200).json(product);

    } catch(error) {
        console.error("Error fetching a product data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;