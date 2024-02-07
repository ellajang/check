import React from 'react'

const YourComponent = () => {
  const arrayOfObjects = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 1, name: 'John' }, // Duplicate key
    { id: 3, name: 'Doe' }
    // Add more objects as needed
  ]

  const seenKeys = new Set()

  return (
    <div>
      {/* Render your React components or do something with uniqueObjects */}
      {arrayOfObjects.map(obj => {
        // Replace 'id' with the key you want to check for uniqueness
        if (!seenKeys.has(obj.id)) {
          seenKeys.add(obj.id)

          return (
            <div key={obj.id}>
              {/* Render object properties */}
              <p>{obj.name}</p>
            </div>
          )
        }

        return null // Skip rendering for duplicate keys
      })}
    </div>
  )
}

export default YourComponent
