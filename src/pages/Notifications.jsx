import React from 'react'

const Notifications = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-lg">Notification {item}</h3>
            <p className="text-gray-600">This is a sample notification message.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
