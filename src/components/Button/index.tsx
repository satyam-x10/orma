import './button.css';

interface Style {
    color: String;
    backgroundColor: String;
    width: String;
    height: String;
    borderRadius: String;
    padding: String;
}

const Button = (props: any) => {
    let buttonStyle: Style = props?.style || { color: "#fff", backgroundColor: '#000', width: '75px', height: 'auto', borderRadius: '3px', padding: '6px',fontSize: '14px', border:0 };
    if(props?.input){
        return (
            <button style={buttonStyle} {...props} className="button">{props?.value}</button>
        )
    }else{
        return (
            <div style={buttonStyle} {...props} className="button">{props?.value}</div>
        )
    }

}

export default Button;