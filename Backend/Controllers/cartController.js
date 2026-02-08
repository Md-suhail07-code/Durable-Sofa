import { Cart } from "../Models/cartModel.js";
import { Product } from "../Models/productModel.js";

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId }).populate("items.productID");

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: { items: [], totalPrice: 0 },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productID } = req.body;

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productID,
            quantity: 1,
            unitPrice: product.basePrice,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (i) => i.productID.toString() === productID
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productID,
          quantity: 1,
          unitPrice: product.basePrice,
        });
      }
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productID");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productID } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.productID.toString() !== productID
        );

        cart.totalPrice = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productID");

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("Remove From Cart Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.userId;
        const { productID, type } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (i) => i.productID.toString() === productID
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart",
            });
        }

        if (type === "increment") {
            item.quantity += 1;
        } else if (type === "decrement" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productID");

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("Update Quantity Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
