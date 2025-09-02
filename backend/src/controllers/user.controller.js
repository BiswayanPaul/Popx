import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const geneateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Could not generate tokens. Please try again")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, password, phonenumber, companyname, agency } = req.body;
    if ([fullname, email, password].some((field) =>
        field?.trim() === "") || agency == null
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        email
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        fullname,
        email,
        password,
        companyname: companyname.toLowerCase(),
        phonenumber,
        agency
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Could not create user. Please try again")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully"
        ))
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not found. Please register")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }


    const { accessToken, refreshToken } = await geneateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
        ))
})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )


    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new ApiError(401, "Unauthorized Request")
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token. Please login again")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await geneateAccessAndRefreshToken(user._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            ))
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token. Please login again")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})




export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser }