(ns ptpt-stats-test
  ;(:use test-helpers)
  (:require [clojure.test :refer [deftest testing is]]
            [polismath.math.named-matrix :as nm]
            [polismath.math.repness :as repness]))


(deftest test-participant-stats
  (testing "should generally be sane"
    (let [group-clusters [{:id 1 :members [1 2]}
                          {:id 2 :members [3 4]}]
          base-clusters [{:id 1 :members [1 2]}
                         {:id 2 :members [3 4]}
                         {:id 3 :members [5 6]}
                         {:id 4 :members [7 8]}]
          proj-nmat (nm/named-matrix
                      [1 2 3 4 5 6 7 8]
                      ["x" "y"]
                      [[0.1 0.2]
                       [0.3 0.4]
                       [0.54 0.63]
                       [0.7 0.8]
                       [-0.1 -0.2]
                       [-0.31 -0.4]
                       [-0.5 -0.6]
                       [-0.7 -0.8]])
          ptpt-vote-counts {1 3, 2 5, 3 2, 4 5, 5 9, 6 3, 7 5, 8 10}]
      (is (not-empty (vec (repness/participant-stats group-clusters base-clusters proj-nmat ptpt-vote-counts)))))))

