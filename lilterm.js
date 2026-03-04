class LilTerm{
	inputs = []
	inputLine = new LilInputLine()
	constructor(){
		this.inputLine.gotInput = (input)=>{
			console.log(input)
			this.lines.push(input)
		}
	}
