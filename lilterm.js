class LilTerm{
	inputs = []
	lines = []
	inputLine = new LilInput()
	div = document.createElement("div")
	historyDiv = document.createElement("div")
	inputDiv = document.createElement("div")
	callables = {}
	constructor(){
		this.inputLine.gotInput = (input)=>{
			this.inputs.unshift(input)
			this.lines.unshift(input)
			this.tryout(input)
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
		while(this.lines.length < nLines)
			this.lines.unshift({raw:""})
	}
	updateHistory(){
		this.historyDiv.innerHTML = this.lines.slice(0, this.lineHeight)
			.reverse()
			.map(input=>`<p>>${input.raw}</p>`)
			.join("")
	}
	focus(){
		this.inputLine.userSpace.focus()
	}
	log(message){
		this.lines.unshift({raw:message})
		this.updateHistory()
	}
	tryout(input){
		this.callables[input.command]?.apply(null, input.args)
	}
	toDataURL(type){
		let data = this.inputs.reverse()
			.map(input=>input.raw).join("\n"),
			blob = new Blob(Array.from(data), {type:type})
		return URL.createObjectURL(blob)
	}
}

LilTerm.defaultLineHeight = 10

class LilInput{
	history = []
	p = document.createElement("p")
	userSpace = document.createElement("span")

	constructor(){
		this.p.innerHTML = ">"
		this.userSpace.setAttribute("contenteditable", "plaintext-only")
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
		if(e.key == "ArrowUp"){
			e.preventDefault()
			this.keyARROWUPPressed(e)
		}
	}
	keyENTERPressed(e){
		let rawInput = this.userSpace.innerHTML,
			commands = rawInput.split("\n")
		let parsed = this.parse(rawInput)
		this.history.unshift(parsed)
		this.gotInput(parsed)
		this.userSpace.innerHTML = ""
	}
	keyARROWUPPressed(e){
		if(this.history.length > 0)
			this.userSpace.innerHTML = this.history[0].raw
	}
	parse(rawInput){
		let parsed = {raw:rawInput.trim()},
			parts = rawInput.split(" ")

		parsed.command = parts.shift()
		parsed.args = parts
		return parsed
	}
	gotInput(){}
}
