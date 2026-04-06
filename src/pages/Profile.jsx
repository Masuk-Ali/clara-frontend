export default function Profile({ user }) {
  return (
    <div>
      <h1 className="text-xl">Profile</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}