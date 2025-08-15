/**
 * Mocks the API call to upload an image and get a job ID.
 * @param {File} imageFile The image file to be "uploaded".
 * @returns {Promise<string>} A promise that resolves with a mock job ID.
 */
export const uploadImageMock = (imageFile) => {
  console.log(`MOCK: Uploading image: ${imageFile.name}`);
  // Simulate network latency
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a mock job ID
      resolve('mock_job_123');
    }, 1500);
  });
};

/**
 * Mocks the API call to poll for analysis results.
 * @param {string} jobId The job ID to check.
 * @returns {Promise<object>} A promise that resolves with mock analysis results.
 */
export const pollForResultsMock = (jobId) => {
  console.log(`MOCK: Polling for results for job: ${jobId}`);
  // Simulate a delay before returning results
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate an AI result.
      const mockResult = {
        diagnosis: 'Positive for Tuberculosis',
        confidence: 0.88
      };
      resolve(mockResult);
    }, 5000); // Simulate a 5-second analysis time
  });
};

/**
 * The real API call to upload an image.
 * This is commented out. Uncomment and use when your backend is ready.
 * @param {File} imageFile The image file to upload.
 * @returns {Promise<string>} A promise that resolves with the job ID.
 */
/*
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('http://your-django-backend.com/api/v1/diagnose/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed.');
  }

  const data = await response.json();
  return data.job_id;
};
*/

/**
 * The real API call to poll for results.
 * This is commented out. Uncomment and use when your backend is ready.
 * @param {string} jobId The job ID to check.
 * @returns {Promise<object>} A promise that resolves with the analysis results.
 */
/*
export const pollForResults = async (jobId) => {
  const response = await fetch(`http://your-django-backend.com/api/v1/diagnose/${jobId}`);

  if (!response.ok) {
    throw new Error('Could not fetch analysis status.');
  }

  const data = await response.json();
  if (data.status === 'completed') {
    return {
      diagnosis: data.diagnosis,
      confidence: data.confidence,
    };
  } else {
    // Return null or throw an error if not completed yet
    return null;
  }
};
*/
