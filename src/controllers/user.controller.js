import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { subscribe } from "diagnostics_channel";
import mongoose from "mongoose";


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

// http://res.cloudinary.com/dolhdt2tr/image/upload/v1755948988/xuxslzddd0iuku6yyqut.png
const deleteOldCloudinaryImage = async (imageUrl) => {
    if (!imageUrl) return;
    const parts = imageUrl.split("/");
    const imageWithExtension = parts[parts.length - 1];
    const imageId = imageWithExtension.split(".")[0];
    await cloudinary.uploader.destroy(imageId);
}


const registerUser = asyncHandler(async (req, res) => {
    // take data from frontend


    // Data validation - not empty

    // check if user already exists : check email and username
    // check for images, check for avatar

    // upload them to cloudinary, avatar is mandatory

    // create user
    // remove password and refresh token from response
    // check for user creation success
    // send response


    const { fullname, email, username, password } = req.body;
    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(500, "Could not upload avatar. Please try again")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
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
    // Steps: 
    // 1. check for email and password in the request body.
    // 2. validate email and password.
    // 3. check if user exists.
    // 4. compare password.
    // 5. generate access and refresh token.
    // 6. save refresh token in db.
    // 7. send response with access and refresh token in cookies.

    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "Email or Username is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
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
        secure: true,
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


const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Steps:
    // 1. get current password and new password from request body.
    // 2. validate both passwords.
    // 3. get user from req.user
    // 4. compare current password.
    // 5. if match, update with new password.
    // 6. save user.
    // 7. send response.

    const { currentPassword, newPassword } = req.body;
    if ([currentPassword, newPassword].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid current password")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})


const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar image is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(500, "Could not upload avatar. Please try again")
    }

    const userToUpdate = await User.findById(req.user._id);

    const oldCoverImageUrl = userToUpdate.coverImage;

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true }).select("-password -refreshToken")


    await user.save({ validateBeforeSave: false });

    await deleteOldCloudinaryImage(oldCoverImageUrl);


    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover image updated successfully"))

})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(500, "Could not upload avatar. Please try again")
    }

    const userToUpdate = await User.findById(req.user._id);

    const oldAvatarUrl = userToUpdate.avatar;

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password -refreshToken")

    await user.save({ validateBeforeSave: false });

    await deleteOldCloudinaryImage(oldAvatarUrl);


    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))

})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channel = await User.aggregate([
        { $match: { username: username?.toLowerCase() } },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "subscriber",
                localField: "_id",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
            }
        }
    ])

    if (!channel || channel.length === 0) {
        throw new ApiError(404, "Channel not found")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "Channel fetched successfully"))

})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req, user._id) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }

                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully")
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory }