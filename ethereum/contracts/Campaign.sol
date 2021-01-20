// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.8.2;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;
    
    function createCampaign(uint minContribution) public {
        Campaign deployedCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(deployedCampaign);
    }
    
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Request {
        uint id;
        string description;
        uint valueToSend;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minContribution;
    mapping(address => bool) approvers;
    uint public approverCount;
    
    //code to manage requests
    mapping (uint => Request) requests;
    uint public requestIndex;
    
    
    modifier restricted()  {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint _minContribution, address _manager) {
        manager = _manager;
        minContribution = _minContribution;
    }
    
    function contribute() public payable {
        require(msg.value > minContribution);
        
        approvers[msg.sender] = true;
        approverCount++;
    }
    
    function createRequest(string calldata _description, uint _valueToSend, address payable _recipient) public restricted {
        uint id = requestIndex++;
        Request storage req2 = requests[id];
           req2.description = _description;
            req2.valueToSend = _valueToSend;
            req2.recipient = _recipient;
            req2.complete = false;
            req2.approvalCount = 0;
            req2.id = id;
    }
    
    function approveRequest(uint id) public {
        require(approvers[msg.sender]);//caller is a registered approver
        
        Request storage req = requests[id];
        require(!req.approvals[msg.sender]);//caller has not already voted on this request
        
        req.approvals[msg.sender] = true;
        req.approvalCount++;
    }
    
    function finalizeRequest(uint id) public restricted {
        Request storage req = requests[id];
        
        require(req.approvalCount > (approverCount / 2));//at least 50% approved
        require(!req.complete);
        
        req.recipient.transfer(req.valueToSend);
        req.complete = true;
    }
    
    function getRequestDescription(uint id) public view returns (string memory) {
        return requests[id].description;
           
    }
}