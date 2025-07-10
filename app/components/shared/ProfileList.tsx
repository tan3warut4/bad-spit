import Profile from "./Profile"

type ProfileListProps = {
    players: { name: string }[]
    handleAddPlayer: () => void
}
const ProfileList = ({ players, handleAddPlayer }: ProfileListProps) => {
    const placeHolderCount = 1
    const placeHolder = Array.from({ length: placeHolderCount })

    return (
        <div className="flex gap-3 flex-wrap">
            {players.map((player, index) => (
                <Profile key={`player-${index}`} name={player.name} />
            ))}
            {placeHolder.map((_, index) => (
                <Profile key={`placeholder-${index}`} name="" handleAddPlayer={handleAddPlayer} />
            ))}
        </div>

    )
}

export default ProfileList