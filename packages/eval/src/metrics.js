export function computeBrierScore(predictions, labels) {
    if (predictions.length === 0 || predictions.length !== labels.length)
        return 0.0;
    let sum = 0.0;
    for (let i = 0; i < predictions.length; i++) {
        const p = predictions[i];
        const y = labels[i] ? 1.0 : 0.0;
        sum += Math.pow(p - y, 2);
    }
    return sum / predictions.length;
}
export function computeReliabilityBins(predictions, labels, numBins = 10) {
    const bins = [];
    for (let b = 0; b < numBins; b++) {
        const binMin = b / numBins;
        const binMax = (b + 1) / numBins;
        let count = 0;
        let confSum = 0.0;
        let correctCount = 0;
        for (let i = 0; i < predictions.length; i++) {
            const p = predictions[i];
            if (p >= binMin && (b === numBins - 1 ? p <= binMax : p < binMax)) {
                count++;
                confSum += p;
                if (labels[i])
                    correctCount++;
            }
        }
        bins.push({
            binMin,
            binMax,
            count,
            avgConfidence: count > 0 ? confSum / count : 0.0,
            empiricalAccuracy: count > 0 ? correctCount / count : 0.0
        });
    }
    return bins;
}
