
import Header from "../Header/header"
const NotFound = () => {
    return (<div>
        <Header />
        <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center', margin: '20px'}}>
            <div>
            <h1>404</h1>
            <p>You’ve reached the edge of the universe. There’s nothing beyond this point.</p>
            </div>
        </div>
    </div>)
}

export default NotFound