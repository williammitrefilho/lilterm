class LilTerm{
	inputs = []
	lines = []
	subject = {}
	name = "lilt"
	div = document.createElement("div")
	historyDiv = document.createElement("div")
	inputDiv = document.createElement("div")
	callables = {}
	static codeToFile(code, name = "code.svg", type="image/svg+xml"){
		let file = new File([this.blobinate(code, type)], name)
		return file
	}
	static isATerm(termClass){

		return termClass.prototype.__proto__ == this.prototype
	}
	static safely(termName){
		let safeName = termName.replaceAll(/[^A-Za-z]/g, '')
		return eval(safeName)
	}
	constructor(){
		this.controller = this
		this.owner = this
		this.setLineHeight(LilTerm.defaultLineHeight)
		this.updateHistory()
		this.div.onclick = ()=>{
			this.focus()
		}
		this.retach(new LilInput())
		this.inputDiv.appendChild(this.inputLine.p)
		this.div.append(this.historyDiv, this.inputDiv)
	}
	on(targetType, targetId, callback){
		let target = this.subject[targetType](targetId)
		if(!target)
			return term.log(`no ${targetType}!?`)

		callback(target)
	}
	retach(inputLine){
		inputLine.gotInput = (input)=>{
			this.inputs.unshift(input)
			this.lines.unshift(input)
			this.tryout(input)
			this.updateHistory()
		}
		this.inputLine = inputLine
	}

	setLineHeight(nLines){
		this.lineHeight = nLines
		while(this.lines.length < nLines)
			this.lines.unshift({raw:""})
	}
	updateHistory(){
		this.historyDiv.innerHTML = this.lines.slice(0, this.lineHeight)
			.reverse()
			.map(input=>`<p>&gt;${input.raw}</p>`)
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
	exit(){
		this.goodbye()
		this.concede(this.owner)
	}
	yurup(){
		this.log("Helou")
	}
	start(terminal){
		terminal.owner = this
		this.concede(terminal)
		terminal.yurup()
	}
	concede(terminal){
		terminal.historyDiv = this.historyDiv 
		terminal.inputDiv = this.inputDiv 
		terminal.retach(this.inputLine)
		terminal.inputLine.label = terminal.name
		this.controller = terminal
	}
	goodbye(){
		this.log("baibai")
	}
}

LilTerm.defaultLineHeight = 10

class LilInput{
	_label = "lilt"
	history = []
	p = document.createElement("p")
	userSpace = document.createElement("span")
	labelSpace = document.createElement("span")

	constructor(){
		this.userSpace.setAttribute("contenteditable", "plaintext-only")
		this.p.appendChild(this.labelSpace)
		this.p.appendChild(this.userSpace)
		this.p.onkeydown = (e)=>{
			this.keyDown(e)
		}
	}
// 10 mar 2026 "Hindsight and Understanding"
	set label(label){
		this._label = label
		this.labelSpace.innerHTML = `${this._label}&gt;`
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
