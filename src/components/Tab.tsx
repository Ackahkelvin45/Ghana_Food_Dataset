'use client'

interface TabProps {
  active: number
  onTabClick?: (page: number) => void
}

function Tab({ active, onTabClick }: TabProps) {
  const handleTabClick = (page: number) => {
    if (onTabClick) {
      onTabClick(page)
    }
  }

  return (
    <div className="w-full h-fit py-2 justify-center items-center flex gap-5">
      {[1, 2, 3, 4, 5, 6].map((page) => (
        <button
          key={page}
          onClick={() => handleTabClick(page)}
          className={`h-1.5 w-10 rounded-lg transition-colors duration-200 ${
            active === page
              ? 'bg-[#ee7c2b] cursor-default'
              : 'bg-gray-300 hover:bg-gray-400 cursor-pointer'
          }`}
          disabled={active === page}
        />
      ))}
    </div>
  )
}

export default Tab