class Teamscore extends React.Component {
    render() {
        return (
            <div className="jumbotron jumbotron-fluid bg-cover bg-dark">
                
                <div className="container">
                    <div className="row" >
                        <div className="col">
                            <h1>Team A</h1>
                        </div>
                        <div className="col"></div>
                        <div className="col"></div>
                    </div>
                    <div className="row" >
                        <div className="col"></div>
                        <div className="col text-center"><h2><span id = "TS">score</span>(<span>overs</span>)</h2></div>
                        <div className="col"></div>
                    </div>
                    <div className="row " >
                        <div className="col border"><h4><span className="inline">batsman A</span></h4><h5><span>runs</span>(<span>balls</span>)</h5></div>
                        <div className="col border"><h4><span className="inline" >batsman B</span></h4><h5><span>runs</span>(<span>balls</span>)</h5></div>
                    </div>
                    <br/>
                    <div className="row " >
                        <div className="col"><span className="inline"><h4>bowler</h4></span><span id="TO"><b>THIS OVER : </b><span className="p-2 rounded-circle border"><b>W</b></span> <span className="p-2 rounded-circle border"><b>Nb</b></span> </span></div>
                    </div>
                </div>
            </div>
        )
    }
}

class Example extends React.Component {
    render() {
        return (
                <div className="container">
                    <div className="row">
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">0</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">1</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">2</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">undo</button></div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">3</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">4</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">6</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">OUT</button></div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">wd</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">Nb</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">BYE</button></div>
                        <div className="col"><button type="button" class="btn btn-secondary btn-lg btn-block">LB</button></div>
                    </div>
                </div>
            
        )
    }
}

ReactDOM.render(<Teamscore/>,document.getElementById('1'))
ReactDOM.render(<Example/>,document.getElementById('d'))
