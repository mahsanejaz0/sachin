import React from 'react'
import AllowedRoutes from './Test1'
const Test = () => {
  const testarr = ["/create-admin","/manage-admin","/test"]
  const test = AllowedRoutes(testarr);

  return (
    <div>
      Lets Test Routess
    </div>
  )
}

export default Test
