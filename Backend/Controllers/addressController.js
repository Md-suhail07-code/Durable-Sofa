import { Address } from "../Models/addressModel";

export const addAddress = async (req, res) => {
    try {
        const { fullName, phone, address, city, state, pinCode, country, isDefault } = req.body;
        const userId = req.user.id;
        if (!fullName || !phone || !address || !city || !state || !pinCode || !country) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const addressCount = await Address.countDocuments({ userId });
        const shouldBeDefault = isDefault || addressCount === 0;

        if (shouldBeDefault) {
            await Address.updateMany({ userId }, { $set: { isDefault: false } });
        }
        const newAddress = new Address({
            userId,
            fullName,
            phone,
            address,
            city,
            state,
            pinCode,
            country: country || "India",
            isDefault: !!isDefault
        });
        await newAddress.save();
        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add address",
            error: error.message
        })
    }
}

export const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            addresses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
            error: error.message
        })
    }
}

export const getDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const defaultAddress = await Address.findOne({ userId, isDefault: true });
        if (!defaultAddress) {
            return res.status(404).json({
                success: false,
                message: "No default address found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Default address fetched successfully",
            address: defaultAddress
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch default address",
            error: error.message
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }
        if (address.isDefault) {
            await Address.findOneAndUpdate(
                { userId },
                { $set: { isDefault: true } },
                { sort: { createdAt: -1 } }
            )
        }
        await Address.deleteOne({ _id: addressId });
        return res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete address",
            error: error.message
        })
    }
}