import React, { SetStateAction } from 'react'
import './style.css'

type Props = {
    sidebar: boolean,
    setSidebar: React.Dispatch<SetStateAction<boolean>>
}

function Backdrop({ sidebar, setSidebar }: Props) {
    return (
        <div
            onClick={() => setSidebar(false)}
            className={sidebar ? "backdrop backdrop-open" : "backdrop"}>

        </div>
    )
}

export default Backdrop