import { Product } from "../Models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      basePrice,
      customizable,
      materials,
      dimensions,
    } = req.body;

    if (
      !name ||
      !category ||
      !description ||
      !basePrice ||
      customizable === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    let productImages = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Durable_Sofa_Products",
        });

        productImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // SAFE JSON parsing
    const parseIfJson = (val) => {
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch {
        return val;
      }
    };

    const newProduct = await Product.create({
      userId: req.userId,
      name,
      category,
      description,
      basePrice,
      customizable,
      productImages,
      materials: parseIfJson(materials),
      dimensions: parseIfJson(dimensions),
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found"
      })
    }

    //Delete image from cloudinary

    if (product.productImages && product.productImages.length > 0) {
      for (let img of product.productImages) {
        await cloudinary.uploader.destroy(img.public_id)
      }
    }

    //Delete Product from Mongodb

    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error : ${error.message}`
    })
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      name,
      category,
      description,
      basePrice,
      customizable,
      materials,
      dimensions,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let updatedImages = [];
    let removedImages = [];

    // 🔹 keep selected old images
    if (existingImages) {
      let existingIds = [];

      try {
        existingIds =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      } catch {
        existingIds = [];
      }

      updatedImages = product.productImages.filter((img) =>
        existingIds.includes(img.public_id)
      );

      removedImages = product.productImages.filter(
        (img) => !existingIds.includes(img.public_id)
      );

      // delete removed images from cloudinary
      for (const img of removedImages) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error("Cloudinary delete failed:", err.message);
        }
      }
    } else {
      updatedImages = product.productImages;
    }

    // add new images
    if (req.files?.length) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Durable_Sofa_Products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const parseIfJson = (val) => {
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch {
        return val;
      }
    };

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (customizable !== undefined) product.customizable = customizable;
    if (materials) product.materials = parseIfJson(materials);
    if (dimensions) product.dimensions = parseIfJson(dimensions);

    product.productImages = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const prod = await Product.findById(_id);
    if (!prod) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Product Fetched Successfully",
      prod
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error : ${error}`
    })
  }
};
