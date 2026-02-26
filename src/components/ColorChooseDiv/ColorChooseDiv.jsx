import ColorButton from "../ColorButton/ColorButton";
import "./ColorChooseDiv.css";

export default function ColorChooseDiv() {
    return(
        <div className="color-choose-div">
            <h3>Цвет<br/>изделия</h3>
            <div className="color-buttons-div">
                <ColorButton style={{'--base-color':'#FF0040'}}/>
                <ColorButton style={{'--base-color':'#5C5C5C'}}/>
                <ColorButton style={{'--base-color':'#FFFFFF', border:'3px solid #5458B0'}}/>
                <ColorButton style={{'--base-color':'#1E1E1E'}}/>
            </div>
        </div>
    );
}