'use client'

import { useEffect, useState } from "react"
import ProfileList from "./components/shared/ProfileList"
import Modal from "./components/shared/Modal"
import Profile from "./components/shared/Profile"

type Team = { p1: string; p2: string }
type Match = { teamA: Team; teamB: Team }

export default function Home() {
  const [players, setPlayers] = useState<{ name: string }[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [player, setPlayer] = useState("")
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [teamStreaks, setTeamStreaks] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players")
    const storedTeams = localStorage.getItem("teams")
    const storedMatches = localStorage.getItem("allMatches")
    const storedMatchIndex = localStorage.getItem("currentMatchIndex")

    if (storedPlayers) setPlayers(JSON.parse(storedPlayers))
    if (storedTeams) setTeams(JSON.parse(storedTeams))
    if (storedMatches) setAllMatches(JSON.parse(storedMatches))
    if (storedMatchIndex) setCurrentMatchIndex(JSON.parse(storedMatchIndex))

    setHydrated(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players))
  }, [players])

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    localStorage.setItem("allMatches", JSON.stringify(allMatches))
  }, [allMatches])

  useEffect(() => {
    localStorage.setItem("currentMatchIndex", JSON.stringify(currentMatchIndex))
  }, [currentMatchIndex])

  if (!hydrated) return null

  const handleAddPlayer = () => setIsAddPlayerOpen(true)

  const addPlayer = (name: string) => {
    setPlayers((prev) => [...prev, { name }])
  }

  const getTeamKey = (team: Team) => `${team.p1}-${team.p2}`

  const formTeams = () => {
    if (players.length < 4) {
      alert("You need at least 4 players to start a tournament.")
      return
    }
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    const formedTeams: Team[] = []
    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      formedTeams.push({ p1: shuffled[i].name, p2: shuffled[i + 1].name })
    }
    setTeams(formedTeams)
    generateAllMatches(formedTeams)
    setCurrentMatchIndex(0)
    setTeamStreaks(new Map())
  }

  const generateAllMatches = (teams: Team[]) => {
    const matches: Match[] = []
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({ teamA: teams[i], teamB: teams[j] })
      }
    }
    setAllMatches(matches)
  }

  const isTeamOverused = (team: Team): boolean => {
    const streaks = teamStreaks
    const key = getTeamKey(team)
    return streaks.get(key) === 2
  }

  const goToNextMatch = () => {
    const nextIndex = allMatches.findIndex((match, index) => {
      if (index <= currentMatchIndex) return false
      return !isTeamOverused(match.teamA) && !isTeamOverused(match.teamB)
    })

    if (nextIndex !== -1) {
      const nextMatch = allMatches[nextIndex]
      const newStreaks = new Map(teamStreaks)

      const teamAKey = getTeamKey(nextMatch.teamA)
      const teamBKey = getTeamKey(nextMatch.teamB)

      newStreaks.set(teamAKey, (newStreaks.get(teamAKey) || 0) + 1)
      newStreaks.set(teamBKey, (newStreaks.get(teamBKey) || 0) + 1)

      // reset streaks for other teams
      teams.forEach((team) => {
        const key = getTeamKey(team)
        if (key !== teamAKey && key !== teamBKey) {
          newStreaks.set(key, 0)
        }
      })

      setCurrentMatchIndex(nextIndex)
      setTeamStreaks(newStreaks)
    } else {
      alert("All matches completed! Generating new round...")
      const shuffled = [...players].sort(() => Math.random() - 0.5)
      const newTeams: Team[] = []
      for (let i = 0; i + 1 < shuffled.length; i += 2) {
        newTeams.push({ p1: shuffled[i].name, p2: shuffled[i + 1].name })
      }
      const newMatches: Match[] = []
      for (let i = 0; i < newTeams.length; i++) {
        for (let j = i + 1; j < newTeams.length; j++) {
          newMatches.push({ teamA: newTeams[i], teamB: newTeams[j] })
        }
      }
      setTeams(newTeams)
      setAllMatches(newMatches)
      setCurrentMatchIndex(0)
      setTeamStreaks(new Map())
    }
  }

  const resetTournament = () => {
    setPlayers([])
    setTeams([])
    setAllMatches([])
    setCurrentMatchIndex(0)
    setTeamStreaks(new Map())
  }

  const currentMatch = allMatches[currentMatchIndex]


  return (
    <div className="px-4">
      <div className="bg-white rounded-3xl p-6">
        <ProfileList players={players} handleAddPlayer={handleAddPlayer} />
        <Modal isOpen={isAddPlayerOpen} onClose={() => setIsAddPlayerOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add Players</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const names = player
                .split(" ")
                .map((name) => name.trim())
                .filter((name) => name.length > 0)

              if (names.length === 0) return

              names.forEach((name) => addPlayer(name))
              setPlayer("")
              setIsAddPlayerOpen(false)
            }}
          >
            <input
              autoFocus
              placeholder="Enter names (e.g. tan gik oak)"
              className="p-2 w-full border border-gray-200 rounded-lg"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
            />
            <button
              type="submit"
              className="w-full p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl mt-5"
            >
              Add Player
            </button>
          </form>
        </Modal>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-gradient-to-r from-[#00d2ff] to-[#3a47d5] hover:scale-105 transition duration-300 text-white rounded-2xl p-4 cursor-pointer" onClick={formTeams} >
          Start Tournament
        </button>
        <button className="flex-1 bg-gradient-to-r from-[#d53369] to-[#c67700] hover:scale-105 transition duration-300 text-white rounded-2xl p-4 cursor-pointer" onClick={resetTournament}>
          Reset All
        </button>
      </div>

      {teams.length > 0 && (
        <div className="bg-white rounded-2xl mt-4 p-5">
          <h3 className="text-lg font-semibold mb-2">Team Pairs</h3>
          <div className="flex gap-4 flex-wrap">
            {teams.map((team, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-xl flex gap-2 items-center">
                <Profile name={team.p1} />
                <Profile name={team.p2} />
              </div>
            ))}
          </div>
        </div>
      )}

      {currentMatch && (
        <div className="bg-white rounded-2xl mt-4 p-5">
          <h3 className="text-lg font-semibold mb-2">
            Match {currentMatchIndex + 1} of {allMatches.length}
          </h3>
          <div className="flex justify-around items-center gap-6">
            <div className="flex gap-2">
              <Profile name={currentMatch.teamA.p1} />
              <Profile name={currentMatch.teamA.p2} />
            </div>
            <span className="text-gray-500 font-bold">vs</span>
            <div className="flex gap-2">
              <Profile name={currentMatch.teamB.p1} />
              <Profile name={currentMatch.teamB.p2} />
            </div>
          </div>
          <button className="mt-4 w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700" onClick={goToNextMatch}>
            Next Match
          </button>
        </div>
      )}

      {currentMatchIndex > 0 && (
        <div className="bg-white rounded-2xl mt-4 p-5">
          <h3 className="text-lg font-semibold mb-2">Played Matches</h3>
          <div className="space-y-3">
            {allMatches.slice(0, currentMatchIndex).map((match, index) => (
              <div key={index} className="bg-amber-100 rounded-xl p-3 flex justify-around items-center">
                <div className="flex gap-2">
                  <Profile name={match.teamA.p1} />
                  <Profile name={match.teamA.p2} />
                </div>
                <span className="text-gray-500 font-medium">vs</span>
                <div className="flex gap-2">
                  <Profile name={match.teamB.p1} />
                  <Profile name={match.teamB.p2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}