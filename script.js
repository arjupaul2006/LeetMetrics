document.addEventListener("DOMContentLoaded",function(){

    const user_input = document.getElementById("input")
    const search_button = document.getElementById("search-btn")

    const stat_container = document.querySelector(".stat")

    // circle
    const easy_progress_cicle=document.querySelector(".easy-progrss")
    const medium_progress_cicle=document.querySelector(".medium-progrss")
    const hard_progress_cicle=document.querySelector(".hard-progrss")

    // label
    const easy_label = document.getElementById("easy")
    const medium_label = document.getElementById("medium")
    const hard_label = document.getElementById("hard")

    // cards
    const stat_card = document.querySelector(".stat-card")


    //check the username is valid or not
    function validUsername(username){
        if(username.trim() === ""){
            alert("The Username should not be empty")
            return false
        }

        const regex = /^(?!.*[-_]{2})[a-zA-Z0-9](?:[a-zA-Z0-9_-]{2,18})[a-zA-Z0-9]$/;
        const isMatching = regex.test(username)   //true or false
        if(!isMatching){
            alert("Username is not valid")
        }
        return isMatching
    }


    //fetch user details
    async function fetchUserDetails(username) {

        try{
            search_button.textContent = "Searching...."
            search_button.style.opacity='0.5'
            search_button.disabled = true 

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);

            if(!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData) ;
            

            displayUserDetails(parsedData)

            stat_container.style.display = "block"

        }
        catch(error){
            stat_container.innerHTML=`<p>Data Not Found</p>`
        }

        finally{
            search_button.textContent = "Search"
            search_button.style.opacity='1'
            search_button.disabled = false
        }

    }


    //Update the circle
    function updateProgess(solved,total,label,circle){
        const progressDegree = (solved/total)*100
        circle.style.setProperty("--progress-deg",`${progressDegree}%`)
        label.textContent=`${solved}/${total}`
    }

    //display user details
    function displayUserDetails(parsedData){
        const totalQuestion = parsedData.data.allQuestionsCount[0].count
        const totalEasyQuestion = parsedData.data.allQuestionsCount[1].count 
        const totalMediumQuestion = parsedData.data.allQuestionsCount[2].count
        const totalHardQuestion = parsedData.data.allQuestionsCount[3].count

        const totalSolvedQuestion = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count
        const totalEasySolvedQuestion = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count
        const totalMediumSolvedQuestion = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count
        const totalHardSolvedQuestion = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count

        updateProgess(totalEasySolvedQuestion,totalEasyQuestion,easy_label,easy_progress_cicle)
        updateProgess(totalMediumSolvedQuestion,totalMediumQuestion,medium_label,medium_progress_cicle)
        updateProgess(totalHardSolvedQuestion,totalHardQuestion,hard_label,hard_progress_cicle)

        const cardsData = [
            {label: "Overall Submission" , value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label: "Overall Easy Submission" , value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label: "Overall Medium Submission" , value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label: "Overall Hard Submission" , value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
        ];

        stat_card.innerHTML = cardsData.map(
            data =>
                `<div class="card" style="color: 'black'">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                </div>`
        ).join("")

        
    }


    function statContainerHidden(){
        stat_container.style.display = "none"
    }


    //if click on search button, then the username is fetch
    search_button.addEventListener('click',function(){
        const username = user_input.value
        console.log(username)

        statContainerHidden()

        // stat_container.style.setProperty("dispaly",none)

        if(validUsername(username)){
            fetchUserDetails(username)
        }
    })

})