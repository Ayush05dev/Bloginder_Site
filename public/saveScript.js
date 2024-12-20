
async function toggleSave(blogId) {
    try {
        const button = document.getElementById(`saveButton-${blogId}`);
        
        // Make an AJAX request to the toggle route
        const response = await fetch(`/user/toggle-save/${blogId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        console.log("result : " ,result);
        
        if (response.ok) {
            // Update button text based on the new state
            button.innerText = result.saved ? 'Unsave' : 'Save';
        } else {
            alert(result.message || 'Error toggling save status');
        }
    } catch (error) {
        console.error('Error toggling save status:', error);
        alert('An error occurred. Please try again.');
    }
}
