import React from 'react'
import Avatar from 'boring-avatars';

type ProfileProps = {
  name: string
  handleAddPlayer?: () => void
}

const Profile = ({ name, handleAddPlayer }: ProfileProps) => {

  return (
    <div className='text-center' >
      {name ? <Avatar name={name} size={48} variant='beam' />
        : <div className='w-12 h-12 rounded-full hover:bg-gray-300 cursor-pointer bg-gray-200 flex items-center justify-center text-2xl text-gray-400'
          onClick={handleAddPlayer}
        >
          {name ? "" : "+"}
        </div>
      }
      <p className='text-sm '>{name?name:<span className='text-xs font-light text-gray-500'>Add player</span>}</p>
    </div>
  )
}

export default Profile