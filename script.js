document.getElementById('generate-bounty').addEventListener('click', async () => {
    const hint = document.getElementById('hint').value;
    if (hint.trim() === '') {
        alert("Please enter a bounty hint.");
        return;
    }

    // Display loading state
    document.getElementById('loading').style.display = 'block';
    document.getElementById('bounty-result').style.display = 'none';

    // Call the AI API to generate the bounty
    const bounty = await generateBountyFromAI(hint);

    // Hide loading state and show generated bounty
    document.getElementById('loading').style.display = 'none';
    document.getElementById('bounty-result').style.display = 'block';

    // Display the generated bounty details
    document.getElementById('bounty-title').textContent = bounty.title;
    document.getElementById('bounty-description').textContent = bounty.description;
});

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

async function generateBountyFromAI(hint) {
    // Simulated delay to mimic an API response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: `Bounty for ${hint}`,
                description: `Description: This bounty is for a task related to: ${hint}. Please provide details and submit to the platform.`
            });
        }, 1000); // 1-second delay
    });
}



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

        // Send transaction
        const tx = await signer.sendTransaction(transaction);
        console.log("Transaction submitted:", tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // Provide feedback to the user
        alert("Transaction successful! View it on Etherscan.");
        return `https://etherscan.io/tx/${tx.hash}`;
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. See console for details.");
        throw error;
    }
}

