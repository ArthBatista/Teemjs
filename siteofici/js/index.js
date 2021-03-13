//home
(() => {
	const BASE_API = "http://localhost:3001"
	
	particlesJS.load('particles', 'assets/particles.json');
	
	new fullpage('#fullpage', {
		autoScrolling: false,
		scrollBar: false,
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['Header', 'Main']
	})

	const buttonMenu = document.querySelector('#menu')
	const cards = document.querySelectorAll('.grid-container .card')
	const langPickerBtns = document.querySelectorAll('.lang-picker .lang')
	
	/* splash Screen */
	function startSplashScreen() {
		setTimeout(() => {
			document.querySelector('.splash-container').classList.add('hide')
		}, 100)
	}
	
	/* Menu */
	function openMenu() {
		document.querySelector("#menu").classList.toggle("change")
		document.querySelector("#nav").classList.toggle("change")
		document.querySelector("#menu-bg").classList.toggle("change-bg")
	}
	
	buttonMenu.addEventListener('click', openMenu)
	
	/* Music Cards */
	function initCard() {
		for(let i=0;i<cards.length;i++) {
			let card = cards[i]
			
			const imageSrc = card.getAttribute('data-image');
			
			card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.8)), url(${imageSrc})`
			
			card.addEventListener('mouseenter', animateCard)
			card.addEventListener('mouseleave', stopAnimateCard)
		}
	}
	
	function animateCard(e) {
		const target = e.target
		let url = `${BASE_API}/play/${target.getAttribute('data-song')}`
		
		const audio = new Audio(url)
		
		target.appendChild(audio)
		
		audio.addEventListener('canplaythrough', playAudio)
		
		audio.addEventListener('timeupdate', () => progressAudio(audio, target))
	}

	function stopAnimateCard(e) {
		const target = e.target
		const audio = target.querySelector('audio')
		
		audio.pause()
		audio.src = ""
		target.removeChild(audio)
	}
	
	function playAudio(e) {
		e.target.play()
	}
	
	function progressAudio(audio, card) {
		const svgCircle = card.querySelector('svg .progress')
		
		let currentTime = audio.currentTime
		let duration = audio.duration
		
		let percentage = currentTime / duration
		let progressDashArray = 3.14 * (2 * svgCircle.getAttribute('r'))
		
		let offsetPercentage = progressDashArray * (1 - percentage)
		
		svgCircle.setAttribute('style', `stroke-dashoffset: ${offsetPercentage}`)
	}
	
	/* Multi Language */
	
	function checkLanguageOfUser() {
		let userLang = navigator.language || navigator.userLanguage
		
		let lang = "pt"
		if(userLang.includes("-")) {
			lang = userLang.split("-")
			lang = lang[0]
		} else
			lang = userLang
			
		if(lang != "pt" && lang != 'en') {
			lang = "en"
		}
		
		for(let i=0;i<langPickerBtns.length;i++) {
			langPickerBtns[i].classList.remove('active')
		}
		document.querySelector(`[data-lang=${lang}]`).classList.add('active')
		
		
		translatePage(lang)
	}
	
	function initLanguaguePicker() {
		for(let i=0;i<langPickerBtns.length;i++) {
			langPickerBtns[i].addEventListener('click', changeLanguage)
		}
	}
	
	function changeLanguage(e) {
		const target = e.target
		let lang = target.getAttribute('data-lang')
		
		setActiveClassOfLangButton(target)
		translatePage(lang)
	}
	
	function setActiveClassOfLangButton(target) {
		if(target.classList.contains('active')) return false
		
		for(let i=0;i<langPickerBtns.length;i++) {
			langPickerBtns[i].classList.remove('active')
		}
		target.classList.add('active')
	}
	
	function translatePage(language) {
		let ajax = new XMLHttpRequest()
		
		let url = `assets/langs/${language}.json`
		ajax.open('GET', url, true)
		
		ajax.onreadystatechange = () => {
			if(ajax.readyState == 4 && ajax.status == 200) {
				let data = ajax.responseText
				data = JSON.parse(data)
				
				document.title = data.title
				
				let textTags = document.querySelectorAll('[lang-key]')
				
				for(let i=0;i<textTags.length;i++) {
					let tag = textTags[i]
					let key = tag.getAttribute('lang-key')
					
					tag.innerText = data[key]
				}
				
			}
		}
		
		ajax.send()
	}
	
	/* Call Functions */
	startSplashScreen()
	initCard()
	checkLanguageOfUser()
	initLanguaguePicker()
})()