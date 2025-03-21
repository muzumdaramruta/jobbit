import User from "../models/userModel.js";

const findUserDetailsById = async (idValue) => {
    return await User.findOne({ _id: idValue })
        .select("-password")
        .select("-updatedAt");
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const saveUser = async (user) => {
    return await user.save();
};

const findUserById = async (id) => {
    return await User.findById(id).populate("company");
};

const findUserWithJobDetails = async (id) => {
    return await User.findById(id).populate(
        "savedJobs postedJobs applications company"
    );
};

const findFollowingUsersById = async (id) => {
    return await User.findById(id).select("following");
};

const updateUsersForUnfollow = async (followUnFollowUserId, currentUserId) => {
    await User.findByIdAndUpdate(followUnFollowUserId, {
        $pull: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: followUnFollowUserId },
    });
};

const updateUsersForFollow = async (followUnFollowUserId, currentUserId) => {
    await User.findByIdAndUpdate(followUnFollowUserId, {
        $push: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
        $push: { following: followUnFollowUserId },
    });
};

const getAllLimitedUserExceptId = async (userId, limit) => {
    return await User.aggregate([
        {
            $match: {
                _id: { $ne: userId },
            },
        },
        {
            $sample: { size: limit },
        },
    ]);
};

const findAllUsers = async () => {
    return await User.find().select("-password");
};

export {
    findUserDetailsById,
    saveUser,
    findUserById,
    findUserByEmail,
    updateUsersForUnfollow,
    updateUsersForFollow,
    findFollowingUsersById,
    getAllLimitedUserExceptId,
    findAllUsers,
    findUserWithJobDetails,
};
