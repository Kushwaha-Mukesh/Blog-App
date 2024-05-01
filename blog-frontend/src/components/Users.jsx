import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { IoInformationCircleOutline } from "react-icons/io5";

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`/api/user/getusers`);
        if (res.data.success) {
          setUsers(res.data.users);
          if (res.data.users.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.newUser.isAdmin) {
      getUsers();
    }
  }, [currentUser.newUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(`/api/user/getusers?startIdx=${startIndex}`);
      if (res.data.success) {
        setUsers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (userId, username) => {
    setUserId(userId);
    setUsername(username);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/user/delete/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      }
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.log(error.response.data.message);
    }
  };
  return (
    <>
      {currentUser.newUser.isAdmin && users.length > 0 ? (
        <div className="flex-1 mx-4 mt-8 overflow-x-auto">
          <table className="table-auto text-center min-w-[800px] w-full">
            <thead>
              <tr className="border-b-8 border-transparent">
                <th>Date Created</th>
                <th>Profile Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b-8 border-transparent">
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <img
                      className="w-12 h-12 rounded-full mx-auto"
                      src={user.profilePicture}
                      alt="profile picture"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheckCircle className="text-green-500 mx-auto" />
                    ) : (
                      <RxCrossCircled className="text-gray-500 mx-auto" />
                    )}
                  </td>
                  <td>
                    <MdDelete
                      onClick={() => handleDeleteClick(user._id, user.name)}
                      className="mx-auto hover:cursor-pointer hover:text-red-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center text-lg">
          There are no users.
        </div>
      )}

      {users.length > 0 && showMore && (
        <button
          onClick={handleShowMore}
          className="text-sm w-full text-center text-teal-500"
        >
          Show More
        </button>
      )}

      {showModal && (
        <div className="absolute top-1/2 left-1/2 rounded-lg py-4 px-8 text-center flex flex-col gap-2 bg-gray-800 text-white">
          <IoInformationCircleOutline className="self-center text-3xl" />
          <p className="text-lg mb-6">
            Are you sure want to delete "{username}" user ?
          </p>
          <p className="flex justify-around">
            <button
              onClick={handleConfirmDelete}
              className="bg-red-500 px-2 rounded-lg text-white text-lg"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-600 text-white px-2 rounded-lg text-lg"
            >
              Cancel
            </button>
          </p>
        </div>
      )}
    </>
  );
};

export default Users;
