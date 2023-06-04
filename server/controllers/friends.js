import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const getUserFriends = async (req, res) => {
    try {
        const user = req.user;

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
        ({ _id, name, pic, headline }) => {
            return { _id, name, pic, headline };
        }
    );
    res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getFriendRequestsList = async (req, res) => {
    try {
        const user = req.user
        const requests = await Promise.all(
            user.friendRequestList.map((id) => User.findById(id))
        );
        const friendRequests = requests.map(
            ({ _id, name, pic, headline }) => {
                return { _id, name, pic, headline };
            }
        );
        res.status(200).json(friendRequests);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        const { ids } = req.body;
        const userId = ids.id
        const friendId = ids.friendId

        const user = await User.findById(userId);
        const friend = await User.findById(friendId)

        let msg = ""

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== userId);
            await user.save();
            await friend.save();

            const chat = await Chat.findOne({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: friendId } } },
                    { users: { $elemMatch: { $eq: userId } } }
                ]
            })
            if (chat) {
                await Chat.deleteOne(chat);

                await Message.deleteMany({chat: chat._id})
            }
            msg = "Friend Removed"
        } else if (friend.friendRequestList.includes(userId)) { 
            friend.friendRequestList = friend.friendRequestList.filter((id) => id !== userId);
            msg = "Friend Request Removed"
            await friend.save();
        } else {
            friend.friendRequestList.unshift(userId);
            msg = "Friend Request Sent"
            await friend.save();
        }

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
        ({ _id, name, headline, pic }) => {
            return { _id, name, headline, pic };
        }
        );

        res.status(200).json({updatedFriends: formattedFriends, msg: msg});

    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}

export const acceptOrRejectRequest = async (req, res) => {
    try {
        let msg = ""
        const { info } = req.body;
        const id = info.userId;
        const friendId = info.friendId;
        const isTrue = info.isTrue;

        const user = await User.findById(id);
        const friend = await User.findById(friendId)

        if (isTrue) {
            user.friends.unshift(friendId);
            friend.friends.unshift(id);

            user.friendRequestList = user.friendRequestList.filter((id) => id !== friendId);

            msg = "Request Accepted"
            await user.save();
            await friend.save();
        } else {
            user.friendRequestList = user.friendRequestList.filter((id) => id !== friendId);

            msg = "Request Rejected"
            await user.save();
        }

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
        ({ _id, name, headline, pic }) => {
            return { _id, name, headline, pic };
        }
    );

    res.status(200).json({updatedFriends: formattedFriends, msg: msg});

    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
}