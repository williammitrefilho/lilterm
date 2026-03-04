class LilTerm{
	inputs = []
	inputLine = new LilInput()
	div = document.createElement("div")
	historyDiv = document.createElement("div")
	inputDiv = document.createElement("div")
	constructor(){
		this.inputLine.gotInput = (input)=>{
			console.log(input)
			this.inputs.unshift(input)
			this.updateHistory()
		}
		this.setLineHeight(LilTerm.defaultLineHeight)
		this.div.append(this.historyDiv, this.inputDiv)
		this.inputDiv.appendChild(this.inputLine.p)
		this.updateHistory()
		this.div.onclick = ()=>{
			this.focus()
		}
	}
	setLineHeight(nLines){
		this.lineHeight = nLines
		while(this.inputs.length < nLines)
			this.inputs.unshift({raw:">"})
	}
	updateHistory(){
		this.historyDiv.innerHTML = this.inputs.slice(0, this.lineHeight)
			.reverse()
			.map(input=>`<p>${input.raw}</p>`)
			.join("")
	}
	focus(){
		this.inputLine.userSpace.focus()
	}
	log(message){
		this.inputs.unshift({raw:message})
		this.updateHistory()
	}
}

LilTerm.defaultLineHeight = 10

class LilInput{
	p = document.createElement("p")
	userSpace = document.createElement("span")

	constructor(){
		this.p.innerHTML = ">"
		this.userSpace.setAttribute("contenteditable", "true")
		this.p.appendChild(this.userSpace)
		this.p.onkeydown = (e)=>{
			this.keyDown(e)
		}
	}
	keyDown(e){
		if(e.key == "Enter"){
			e.preventDefault()
			this.keyENTERPressed(e)
		}
	}
	keyENTERPressed(e){
		let rawInput = this.userSpace.innerHTML
		this.gotInput(this.parse(rawInput))
		this.userSpace.innerHTML = ""
	}
	parse(rawInput){
		let parsed = {raw:rawInput},
			parts = rawInput.split(" ")

		parsed.command = parts.shift()
		parsed.args = parts
		return parsed
	}
	gotInput(){}
}
