import { BrowserRouter } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <UserRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
