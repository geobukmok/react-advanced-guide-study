interface Props {
  user: { name: string };
}

function MyPage({ user }: Props) {
  return <p>hi! {user.name}</p>;
}

export default MyPage;
