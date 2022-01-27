import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../Utils/queries';
import Auth from '../Utils/auth';
import { ADD_FRIEND } from '../Utils/mutations';

const Profile = () => {
  const [addFriend] = useMutation(ADD_FRIEND);

  // retrieves username from the URL
  const { username: name } = useParams();
  
  const { loading, data } = useQuery(name ? QUERY_USER : QUERY_ME, { // conditionally deciding which query to run
    variables: { username: name }
  });

  const user = data?.me || data?.user || {};

  // need to convert to lower case to get both names to match
  if (Auth.loggedIn() && Auth.getProfile().data.username.toLowerCase() === name) {
       return <Navigate to="/profile" />
    }

  if (loading) {
    return <div>Loading...</div>;
  }

  // navigating to /profile without being logged in. 
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id}
      })
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* if the user param is present then display that user's name - if not displays logged in users name */}
          Viewing {name ? `${user.username}'s` : 'your'} profile.
        </h2>

        {name && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList 
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!name && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
