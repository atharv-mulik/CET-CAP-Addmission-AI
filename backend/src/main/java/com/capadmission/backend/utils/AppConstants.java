package com.capadmission.backend.utils;

import java.util.List;
import java.util.Map;

public class AppConstants {
    public static final Map<String, List<String>> DOCUMENTS_BY_CATEGORY = Map.of(
            "OPEN",
            List.of("10th Marksheet", "12th Marksheet", "MHT-CET Scorecard", "Domicile Certificate",
                    "Leaving Certificate"),
            "OBC",
            List.of("10th Marksheet", "12th Marksheet", "MHT-CET Scorecard", "Caste Certificate", "Caste Validity",
                    "Non-Creamy Layer"),
            "SC",
            List.of("10th Marksheet", "12th Marksheet", "MHT-CET Scorecard", "Caste Certificate", "Caste Validity"),
            "ST",
            List.of("10th Marksheet", "12th Marksheet", "MHT-CET Scorecard", "Caste Certificate", "Caste Validity"),
            "EWS", List.of("10th Marksheet", "12th Marksheet", "MHT-CET Scorecard", "EWS Certificate",
                    "Domicile Certificate"));
}
