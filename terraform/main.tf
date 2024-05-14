provider "aws" {
  region = "us-east-1"
}

resource "aws_elastic_beanstalk_application" "myapp" {
  name        = "champions-club-application"
  description = "Champions Club Nest.js Application"
}

resource "aws_elastic_beanstalk_environment" "myenv" {
  name                = "ChampionsClub-env"
  application         = aws_elastic_beanstalk_application.myapp.name
  solution_stack_name = "64bit Amazon Linux 2 v5.2.3 running Node.js 14"

  setting {
    namespace = "aws:elasticbeanstalk:container:nodejs"
    name      = "NodeCommand"
    value     = "npm run start"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "Port"
    value     = "8080"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "3"
  }
}


