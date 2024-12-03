document.getElementById('generate-bounty').addEventListener('click', async () => {
    const hint = document.getElementById('hint').value;
    if (hint.trim() === '') {
        alert("Please enter a bounty hint.");
        return;
    }

    // Display loading state with dynamic text
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = 'Generating bounty idea... Please wait.';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('bounty-result').style.display = 'none';

    try {
        // Call the simulated API to generate the bounty (you can replace this with a real API)
        const bounty = await generateBountyFromAPI(hint);

        // Hide loading state and show generated bounty
        document.getElementById('loading').style.display = 'none';
        document.getElementById('bounty-result').style.display = 'block';

        // Display the generated bounty details dynamically
        document.getElementById('bounty-title').textContent = bounty.title;
        document.getElementById('bounty-description').textContent = bounty.description;
    } catch (error) {
        // In case of an error, hide loading and show an alert
        document.getElementById('loading').style.display = 'none';
        alert('Failed to generate bounty idea.');
    }
});

// Simulated function to generate bounty idea from an API
async function generateBountyFromAPI(hint) {
    // Simulated delay to mimic an API response
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const ideas = [
                {
                    title: `Bounty: Build a Smart Contract for ${hint}`,
                    description: `This bounty involves creating a secure smart contract for ${hint}. Focus on security and efficiency.`
                },
                {
                    title: `Bounty: Develop an AI Algorithm for ${hint}`,
                    description: `Create an AI-based solution for ${hint}. The task involves creating a predictive model for the given use case.`
                },
                {
                    title: `Bounty: Design a Web App for ${hint}`,
                    description: `Design and implement a responsive web application for ${hint}. Ensure it follows best UI/UX principles.`
                },
                {
                    title: `Bounty: Cryptocurrency Wallet for ${hint}`,
                    description: `Develop a secure cryptocurrency wallet for ${hint}, focusing on both security and user experience.`
                }
            ];

            // Return a random bounty idea
            const bounty = ideas[Math.floor(Math.random() * ideas.length)];
            resolve(bounty);
        }, 1500); // Simulate a 1.5-second delay (to mimic real API response time)
    });
}

document.getElementById('submit-bounty').addEventListener('click', async () => {
    const chain = document.getElementById('chain').value;
    const amount = document.getElementById('amount').value;
    const title = document.getElementById('bounty-title').textContent;
    const description = document.getElementById('bounty-description').textContent;

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid bounty amount.");
        return;
    }

    // Submit the bounty on the blockchain
    document.getElementById('loading').style.display = 'block';
    const transactionLink = await submitBountyToBlockchain(chain, amount, title, description);

    // Hide loading and show result link
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result-link').style.display = 'block';
    document.getElementById('bounty-link').href = transactionLink;
});

async function submitBountyToBlockchain(chain, amount, title, description) {
    if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask to use this feature.");
        throw new Error("MetaMask not found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
        // Request accounts
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const transaction = {
            to: "0x1234567890abcdef1234567890abcdef12345678", // Replace with actual address
            value: ethers.utils.parseEther(amount.toString()),
            data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${title}: ${description}`))
        };

        const tx = await signer.sendTransaction(transaction);
        await tx.wait();
        return `https://etherscan.io/tx/${tx.hash}`;
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. See console for details.");
        throw error;
    }
}
