import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { PeriodicElement } from '../types/element'
import { X, Trophy, Clock } from 'lucide-react'

interface QuizProps {
  elements: PeriodicElement[]
  onClose: () => void
}

export const Quiz: React.FC<QuizProps> = ({ elements, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)

  // Shuffle elements for quiz
  const shuffledElements = useMemo(() => {
    if (!elements || elements.length === 0) {
      console.warn('Quiz: No elements provided', elements)
      return []
    }
    const shuffled = [...elements].sort(() => Math.random() - 0.5)
    console.log('Quiz: Shuffled elements', shuffled.length)
    return shuffled
  }, [elements, shuffleKey])

  const currentElement = shuffledElements.length > 0 ? shuffledElements[currentIndex] : null
  const totalQuestions = shuffledElements.length

  // Ensure we have elements before rendering
  useEffect(() => {
    if (elements && elements.length > 0 && shuffledElements.length === 0) {
      console.warn('Quiz: Elements provided but shuffled array is empty')
    }
  }, [elements, shuffledElements])

  // Early return if no elements
  if (!elements || elements.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
        <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">오류</h2>
            <p className="text-slate-300 mb-6">원소 데이터를 불러올 수 없습니다.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Generate 3 options: 1 correct + 2 random incorrect
  const options = useMemo(() => {
    if (!currentElement) return []
    
    const correctAnswer = currentElement.name_ko
    const incorrectOptions = elements
      .filter(e => e.name_ko !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(e => e.name_ko)
    
    const allOptions = [correctAnswer, ...incorrectOptions]
    return allOptions.sort(() => Math.random() - 0.5)
  }, [currentElement, elements])

  // Define handleAnswer before using it in useEffect
  const handleAnswer = useCallback((answer: string | null) => {
    if (isAnswered) return

    setIsAnswered(true)
    setSelectedAnswer(answer)

    if (answer === currentElement?.name_ko) {
      setScore(prev => prev + 1)
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev < totalQuestions - 1) {
          setIsAnswered(false)
          setSelectedAnswer(null)
          return prev + 1
        } else {
          // Quiz finished
          setIsFinished(true)
          setShowResult(true)
          return prev
        }
      })
    }, 1500)
  }, [isAnswered, currentElement, totalQuestions])

  // Reset timer when question changes
  useEffect(() => {
    if (!isAnswered && !isFinished && !showResult) {
      setTimeLeft(10)
    }
  }, [currentIndex, isAnswered, isFinished, showResult])

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isFinished || showResult) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up - mark as wrong
      handleAnswer(null)
    }
  }, [timeLeft, isAnswered, isFinished, showResult, handleAnswer])

  const handleExit = () => {
    setShowResult(true)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setTimeLeft(10)
    setIsAnswered(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsFinished(false)
    setShuffleKey(prev => prev + 1) // Re-shuffle elements
  }

  if (showResult) {
    const percentage = Math.round((score / (currentIndex + 1)) * 100)
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
        <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold text-white mb-4">퀴즈 결과</h2>
            <div className="space-y-4 mb-6">
              <div className="text-6xl font-extrabold text-blue-500">{score}</div>
              <div className="text-xl text-slate-300">
                {currentIndex + 1}문제 중 {score}문제 정답
              </div>
              <div className="text-2xl font-semibold text-slate-200">
                정답률: {percentage}%
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                다시 시작
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentElement) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
        <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">로딩 중...</h2>
            <p className="text-slate-300">퀴즈를 준비하고 있습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" style={{ zIndex: 9999 }}>
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-white font-semibold">
              문제 {currentIndex + 1} / {totalQuestions}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">점수: {score}</span>
            </div>
          </div>
          <button
            onClick={handleExit}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-medium">남은 시간</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft > 5
                  ? 'bg-green-500'
                  : timeLeft > 2
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-3xl font-bold text-white">{timeLeft}초</span>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-slate-400 mb-4">이 원소의 이름은?</div>
          <div className="text-8xl font-bold text-white mb-4">
            {currentElement.symbol}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => {
            const isCorrect = option === currentElement.name_ko
            const isSelected = selectedAnswer === option
            let buttonClass = 'w-full px-6 py-4 rounded-lg font-medium text-lg transition-all '

            if (isAnswered) {
              if (isCorrect) {
                buttonClass += 'bg-green-600 text-white'
              } else if (isSelected) {
                buttonClass += 'bg-red-600 text-white'
              } else {
                buttonClass += 'bg-slate-700 text-slate-400'
              }
            } else {
              buttonClass += 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer'
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
